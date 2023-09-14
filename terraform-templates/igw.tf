resource "aws_internet_gateway" "saral_igw" {
  vpc_id = aws_vpc.saral_vpc.id

  tags = {
    Name = "saral_igw"
  }
}
