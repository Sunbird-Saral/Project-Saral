resource "aws_eip" "saral_ekstep_nat" {
  vpc = true

  tags = {
    Name = "saral_ekstep_nat"
  }
}

resource "aws_nat_gateway" "saral_ekstep_nat" {
  allocation_id = aws_eip.saral_ekstep_nat.id
  subnet_id     = aws_subnet.saral_ekstep_public-ap-south-1a.id

  tags = {
    Name = "saral_ekstep_nat"
  }

  depends_on = [aws_internet_gateway.saral_ekstep_igw]
}
