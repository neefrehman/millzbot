variable "project_name" {
  type = string
}

variable "credentials_file" {
  type = string
}

variable "region" {
  type = string
}

variable "docker_image_url" {
  type        = string
  sensitive   = true
}

variable "request_token" {
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

