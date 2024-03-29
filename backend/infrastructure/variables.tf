variable "GCP_PROJECT_NAME" {
  type = string
}

variable "GCP_CREDENTIALS_FILE_NAME" {
  type = string
}

variable "GCP_REGION" {
  type = string
}

variable "DOCKER_IMAGE_URL" {
  type        = string
  sensitive   = true
}

variable "REQUEST_TOKEN" {
  type        = string
  sensitive   = true
}

variable "SLACK_BOT_NAME" {
  type        = string
  sensitive   = true
}

variable "SLACK_BOT_USER_TOKEN" {
  type        = string
  sensitive   = true
}

variable "SLACK_CLIENT_ID" {
  type        = string
  sensitive   = true
}

variable "SLACK_CLIENT_SECRET" {
  type        = string
  sensitive   = true
}

variable "SLACK_SIGNING_SECRET" {
  type        = string
  sensitive   = true
}

variable "STAGE" {
  type        = string
  sensitive   = true
}

variable "TWITTER_CONSUMER_KEY" {
  type        = string
  sensitive   = true
}

variable "TWITTER_CONSUMER_SECRET" {
  type        = string
  sensitive   = true
}

variable "TWITTER_ACCESS_KEY" {
  type        = string
  sensitive   = true
}

variable "TWITTER_ACCESS_SECRET" {
  type        = string
  sensitive   = true
}

