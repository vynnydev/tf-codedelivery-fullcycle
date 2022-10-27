module "network" {
  source = "./modules/network"
}

module "master" {
  source = "./modules/master"

  vpc_self_link    = module.network.vpc
  subnet_self_link = module.network.subnet
}

/*
module "kafka_confluent" {
  source = "./modules/kafka_confluent"

  confluent_cloud_api_key    = var.confluent_cloud_api_key
  confluent_cloud_api_secret = var.confluent_cloud_api_secret
}
*/
