resource "aws_vpc" "saral_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "saral_vpc"
  }
}
