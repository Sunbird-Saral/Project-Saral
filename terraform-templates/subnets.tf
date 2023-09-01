resource "aws_subnet" "saral_private-ap-south-1a" {
  vpc_id            = aws_vpc.saral_vpc.id
  cidr_block        = "10.0.0.0/19"
  availability_zone = "ap-south-1a"

  tags = {
    "Name"                            = "saral_private-ap-south-1a"
    "kubernetes.io/role/internal-elb" = "1"
    "kubernetes.io/cluster/demo"      = "owned"
  }
}

resource "aws_subnet" "saral_private-ap-south-1b" {
  vpc_id            = aws_vpc.saral_vpc.id
  cidr_block        = "10.0.32.0/19"
  availability_zone = "ap-south-1b"

  tags = {
    "Name"                            = "saral_private-ap-south-1b"
    "kubernetes.io/role/internal-elb" = "1"
    "kubernetes.io/cluster/demo"      = "owned"
  }
}

resource "aws_subnet" "saral_public-ap-south-1a" {
  vpc_id                  = aws_vpc.saral_vpc.id
  cidr_block              = "10.0.64.0/19"
  availability_zone       = "ap-south-1a"
  map_public_ip_on_launch = true

  tags = {
    "Name"                       = "saral_public-ap-south-1a"
    "kubernetes.io/role/elb"     = "1"
    "kubernetes.io/cluster/demo" = "owned"
  }
}

resource "aws_subnet" "saral_public-ap-south-1b" {
  vpc_id                  = aws_vpc.saral_vpc.id
  cidr_block              = "10.0.96.0/19"
  availability_zone       = "ap-south-1b"
  map_public_ip_on_launch = true

  tags = {
    "Name"                       = "saral_public-ap-south-1b"
    "kubernetes.io/role/elb"     = "1"
    "kubernetes.io/cluster/demo" = "owned"
  }
}
