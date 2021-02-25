terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "3.5.0"
    }
  }
}

provider "google" {
  credentials = file("millzbot-691b446280a5.json")
  project = "millzbot"
  region  = var.region
}

provider "archive" {}


# 
# Docker image must be built and uploaded by the CLI
# 


# 
# Cloud Run
# 
resource "google_cloud_run_service" "gpt" {
  name     = "gpt-tf"
  location = var.region
  template {
    spec {
      # timeout_seconds       = 180
      container_concurrency = 1
      containers {
        image = var.docker_image_url
        # memory_allocated = 2gb
        # cpu_allocated = 2
        # env {
        #   name = "PORT"
        #   value = "8080"
        # }
        # env {
        #   name = "REQUEST_TOKEN"
        #   value = var.request_token
        # }
      }
    }
  }
  traffic {
    percent         = 100
    latest_revision = true
  }
}

# Create public access
data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

# Enable public access on Cloud Run service
resource "google_cloud_run_service_iam_policy" "noauth" {
  location    = google_cloud_run_service.gpt.location
  project     = google_cloud_run_service.gpt.project
  service     = google_cloud_run_service.gpt.name
  policy_data = data.google_iam_policy.noauth.policy_data
}

# Return service URL
output "cloud_run_url" {
  value = google_cloud_run_service.gpt.status[0].url
}


# 
# CLOUD FUNCTIONS
# 
# Cloud functions — store
resource "google_storage_bucket" "functions_source_store" {
  name   = "functions_source_store"
  location = var.region
}


# Cloud functions — frontend
data "archive_file" "frontend_source_dist" {
  type        = "zip"
  source_dir  = "./functions/frontend"
  output_path = "./functions/dist/frontend_source.zip"
}

resource "google_storage_bucket_object" "frontend_source_code" {
  name   = "frontend-source-code"
  bucket = google_storage_bucket.functions_source_store.name
  source = data.archive_file.frontend_source_dist.output_path
}

resource "google_cloudfunctions_function" "handle_frontend_request" {
  name        = "handle_frontend_request-tf"
  runtime     = "Python 3.7"
  available_memory_mb   = 256
  source_archive_bucket = google_storage_bucket.functions_source_store.name
  source_archive_object = google_storage_bucket_object.frontend_source_code.name
  trigger_http          = true
  timeout               = 180
  entry_point           = "handle_frontend_request"
  region                = var.region

  environment_variables = {
    REQUEST_TOKEN  = var.request_token
    MODEL_ENDPOINT = google_cloud_run_service.gpt.status[0].url
  }
}


# Cloud functions — slack
data "archive_file" "slack_source_dist" {
  type        = "zip"
  source_dir  = "./functions/slack"
  output_path = "./functions/dist/slack_source.zip"
}

resource "google_storage_bucket_object" "slack_source_code" {
  name   = "slack-source-code"
  bucket = google_storage_bucket.functions_source_store.name
  source = data.archive_file.slack_source_dist.output_path
}

resource "google_cloudfunctions_function" "handle_slack_request" {
  name        = "handle_slack_request-tf"
  runtime     = "Python 3.7"
  available_memory_mb   = 256
  source_archive_bucket = google_storage_bucket.functions_source_store.name
  source_archive_object = google_storage_bucket_object.slack_source_code.name
  trigger_http          = true
  timeout               = 180
  entry_point           = "handle_slack_request"
  region                = var.region

  environment_variables = {
    REQUEST_TOKEN        = var.request_token
    MODEL_ENDPOINT       = google_cloud_run_service.gpt.status[0].url
    SLACK_BOT_USER_TOKEN = var.SLACK_BOT_USER_TOKEN
    SLACK_CLIENT_ID      = var.SLACK_CLIENT_ID
    SLACK_CLIENT_SECRET  = var.SLACK_CLIENT_SECRET
    SLACK_SIGNING_SECRET = var.SLACK_SIGNING_SECRET
    STAGE                = var.STAGE
  }
}


# Cloud functions — twitter
data "archive_file" "twitter_source_dist" {
  type        = "zip"
  source_dir  = "./functions/twitter"
  output_path = "./functions/dist/twitter_source.zip"
}

resource "google_storage_bucket_object" "twitter_source_code" {
  name   = "twitter-source-code"
  bucket = google_storage_bucket.functions_source_store.name
  source = data.archive_file.twitter_source_dist.output_path
}

resource "google_cloudfunctions_function" "handle_post_tweet" {
  name        = "handle_post_tweet-tf"
  runtime     = "Python 3.7"
  available_memory_mb   = 256
  source_archive_bucket = google_storage_bucket.functions_source_store.name
  source_archive_object = google_storage_bucket_object.twitter_source_code.name
  trigger_http          = true
  timeout               = 180
  entry_point           = "handle_post_tweet"
  region                = var.region

  environment_variables = {
    REQUEST_TOKEN   = var.request_token
    MODEL_ENDPOINT  = google_cloud_run_service.gpt.status[0].url
    CONSUMER_KEY    = var.TWITTER_CONSUMER_KEY
    CONSUMER_SECRET = var.TWITTER_CONSUMER_SECRET
    ACCESS_KEY      = var.TWITTER_ACCESS_KEY
    ACCESS_SECRET   = var.TWITTER_ACCESS_SECRET
  }
}

# Cloud function scheduler — twitter
resource "google_cloud_scheduler_job" "post_scheduled_tweet" {
  name             = "post-scheduled-tweet-tf"
  description      = "run handle_post_tweet function"
  schedule         = "0 8,12,17 * * *"
  time_zone        = "Africa/Abidjan"
  region           = var.region

  http_target {
    http_method = "POST"
    uri         = google_cloudfunctions_function.handle_post_tweet.https_trigger_url
  }
}
