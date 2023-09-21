resource "aws_vpc" "saral_ekstep_vpc" {
  cidr_block = "20.0.0.0/16"

  tags = {
    Name = "saral_ekstep_vpc"
  }
}
