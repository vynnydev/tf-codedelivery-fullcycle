provider "confluent" {
  cloud_api_key    = var.cft_cloud_api_key    # optionally use CONFLUENT_CLOUD_API_KEY env var
  cloud_api_secret = var.cft_cloud_api_secret # optionally use CONFLUENT_CLOUD_API_SECRET env var
}

resource "confluent_environment" "staging" {
  display_name = "Staging"

  lifecycle {
    prevent_destroy = true
  }
}

# Update the config to use a cloud provider and region of your choice.
# https://registry.terraform.io/providers/confluentinc/confluent/latest/docs/resources/confluent_kafka_cluster
resource "confluent_kafka_cluster" "basic" {
  display_name = "kafka_cluster"
  availability = "SINGLE_ZONE"
  cloud        = "GCP"
  region       = "us-central1"
  basic {}

  environment {
    id = confluent_environment.staging.id
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "confluent_service_account" "app-manager" {
  display_name = "app-manager"
  description  = "Service account to manage Kafka cluster"
}
