resource "aws_internet_gateway" "saral_ekstep_igw" {
  vpc_id = aws_vpc.saral_ekstep_vpc.id

  tags = {
    Name = "saral_ekstep_igw"
  }
}
