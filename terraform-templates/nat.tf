resource "aws_eip" "saral_nat" {
  vpc = true

  tags = {
    Name = "saral_nat"
  }
}

resource "aws_nat_gateway" "saral_nat" {
  allocation_id = aws_eip.saral_nat.id
  subnet_id     = aws_subnet.saral_public-ap-south-1a.id

  tags = {
    Name = "saral_nat"
  }

  depends_on = [aws_internet_gateway.saral_igw]
}
