terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "3.58.0"
    }
  }
}

provider "google" {
  credentials = file(var.gcp_credentials_file_name) # this file must be downloaded from gcp
  project = var.gcp_project_name
  region  = var.gcp_region
}

provider "archive" {}



# 
# Docker image must be built and uploaded by the CLI
# and its image url added to terraform.tfvars
# 



# 
# CLOUD RUN
# 
resource "google_cloud_run_service" "gpt" {
  name     = "gpt"
  location = var.gcp_region
  template {
    spec {
      container_concurrency = 1
      timeout_seconds       = 180
      containers {
        image = var.docker_image_url
        resources {
          limits = {
            cpu    = "2"
            memory = "2G"
          }
        }
        env {
          name = "REQUEST_TOKEN"
          value = var.request_token
        }
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



# 
# CLOUD FUNCTIONS
# 
# Cloud functions — store
resource "google_storage_bucket" "functions_source_store" {
  name   = "functions_source_store"
  location = var.gcp_region
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
  name        = "handle_frontend_request"
  runtime     = "python37"
  available_memory_mb   = 256
  source_archive_bucket = google_storage_bucket.functions_source_store.name
  source_archive_object = google_storage_bucket_object.frontend_source_code.name
  trigger_http          = true
  timeout               = 180
  entry_point           = "handle_frontend_request"
  region                = var.gcp_region

  environment_variables = {
    MODEL_ENDPOINT = google_cloud_run_service.gpt.status[0].url
    REQUEST_TOKEN  = var.request_token
  }
}

resource "google_cloudfunctions_function_iam_member" "frontend_invoker" {
  project        = google_cloudfunctions_function.handle_frontend_request.project
  region         = google_cloudfunctions_function.handle_frontend_request.region
  cloud_function = google_cloudfunctions_function.handle_frontend_request.name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}

output "frontend_endpoint_url" {
  value = google_cloudfunctions_function.handle_frontend_request.https_trigger_url
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
  name        = "handle_slack_request"
  runtime     = "python37"
  available_memory_mb   = 256
  source_archive_bucket = google_storage_bucket.functions_source_store.name
  source_archive_object = google_storage_bucket_object.slack_source_code.name
  trigger_http          = true
  timeout               = 180
  entry_point           = "handle_slack_request"
  region                = var.gcp_region

  environment_variables = {
    MODEL_ENDPOINT       = google_cloud_run_service.gpt.status[0].url
    REQUEST_TOKEN        = var.request_token
    SLACK_BOT_NAME       = var.SLACK_BOT_NAME
    SLACK_BOT_USER_TOKEN = var.SLACK_BOT_USER_TOKEN
    SLACK_CLIENT_ID      = var.SLACK_CLIENT_ID
    SLACK_CLIENT_SECRET  = var.SLACK_CLIENT_SECRET
    SLACK_SIGNING_SECRET = var.SLACK_SIGNING_SECRET
    STAGE                = var.STAGE
  }
}

resource "google_cloudfunctions_function_iam_member" "slack_invoker" {
  project        = google_cloudfunctions_function.handle_slack_request.project
  region         = google_cloudfunctions_function.handle_slack_request.region
  cloud_function = google_cloudfunctions_function.handle_slack_request.name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}

output "slack_endpoint_url" {
  value = google_cloudfunctions_function.handle_slack_request.https_trigger_url
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
  name        = "handle_post_tweet"
  runtime     = "python37"
  available_memory_mb   = 256
  source_archive_bucket = google_storage_bucket.functions_source_store.name
  source_archive_object = google_storage_bucket_object.twitter_source_code.name
  trigger_http          = true
  timeout               = 180
  entry_point           = "handle_post_tweet"
  region                = var.gcp_region

  environment_variables = {
    MODEL_ENDPOINT  = google_cloud_run_service.gpt.status[0].url
    REQUEST_TOKEN   = var.request_token
    CONSUMER_KEY    = var.TWITTER_CONSUMER_KEY
    CONSUMER_SECRET = var.TWITTER_CONSUMER_SECRET
    ACCESS_KEY      = var.TWITTER_ACCESS_KEY
    ACCESS_SECRET   = var.TWITTER_ACCESS_SECRET
  }
}

resource "google_cloudfunctions_function_iam_member" "twitter_invoker" {
  project        = google_cloudfunctions_function.handle_post_tweet.project
  region         = google_cloudfunctions_function.handle_post_tweet.region
  cloud_function = google_cloudfunctions_function.handle_post_tweet.name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}

# Cloud function scheduler — twitter
resource "google_cloud_scheduler_job" "post_scheduled_tweet" {
  name             = "post-scheduled-tweet"
  description      = "run handle_post_tweet function"
  schedule         = "0 8,12,17 * * 1-5"
  time_zone        = "Africa/Abidjan"
  region           = var.gcp_region

  http_target {
    http_method = "POST"
    uri         = google_cloudfunctions_function.handle_post_tweet.https_trigger_url
  }
}
