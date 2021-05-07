# Terraform

Also included in this folder is configuration for [terraform](https://www.terraform.io/), a tool with which you can declare all your infrastructure as code, to keep it declarative and version controled. Go to the [`main.tf` file](https://github.com/neefrehman/millzbot/tree/master/server/infrastructure/main.tf) to see the exact infrastructure that millzbot runs on.

You can also use that code to quickly set up your own bot infrastructure. To get started, follow the [Terraform docs](https://registry.terraform.io/providers/hashicorp/google/latest/docs/), get your GCP credentials, and create a `terraform.tfvars` file with your own variables in it (based off [the `terraform.tfvars.example` file](https://github.com/neefrehman/millzbot/tree/master/server/infrastructure/terraform.tfvars.example)). Once this is done, all you should need to do is run `terraform apply` in this directory to get your bot up and running (requires terraform 0.14).
