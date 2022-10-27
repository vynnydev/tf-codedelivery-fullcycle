terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
    confluent = {
      source  = "confluentinc/confluent"
      version = "1.0.0"
    }
  }

  backend "gcs" {
    bucket = "2aca14249b80f64c-bucket-tfstate"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = "tfk8s-366523"
  region  = "us-central1"
}
