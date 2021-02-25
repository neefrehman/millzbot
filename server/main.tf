terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "3.5.0"
    }
  }
}

locals {
  region = "europe-west2"
}

provider "google" {
  credentials = file("millzbot-691b446280a5.json")
  project = "millzbot"
  region  = local.region
}

provider "archive" {}


# TODO: docker image
# TODO: cloud run


# Cloud functions — store
resource "google_storage_bucket" "functions_source_store" {
  name   = "functions_source_store"
  location = local.region
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
  region                = local.region

  # environment_variables = {
  #   MY_ENV_VAR = "my-env-var-value"
  # }
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
  region                = local.region

  # environment_variables = {
  #   MY_ENV_VAR = "my-env-var-value"
  # }
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

resource "google_cloudfunctions_function" "handle_post_tweet_tf" {
  name        = "handle_post_tweet-tf"
  runtime     = "Python 3.7"
  available_memory_mb   = 256
  source_archive_bucket = google_storage_bucket.functions_source_store.name
  source_archive_object = google_storage_bucket_object.twitter_source_code.name
  trigger_http          = true
  timeout               = 180
  entry_point           = "handle_post_tweet"
  region                = local.region

  # environment_variables = {
  #   MY_ENV_VAR = "my-env-var-value"
  # }
}

# Cloud scheduler — twitter
resource "google_cloud_scheduler_job" "job" {
  name             = "post-scheduled-tweet-tf"
  description      = "run handle_post_tweet function"
  schedule         = "0 8,12,17 * * *"
  time_zone        = "Africa/Abidjan"
  region           = local.region

  http_target {
    http_method = "POST"
    uri         = google_cloudfunctions_function.handle_post_tweet_tf.https_trigger_url
  }
}
