resource "aws_route_table" "saral_ekstep_private" {
  vpc_id = aws_vpc.saral_ekstep_vpc.id

  route = [
    {
      cidr_block                 = "0.0.0.0/0"
      nat_gateway_id             = aws_nat_gateway.saral_ekstep_nat.id
      carrier_gateway_id         = ""
      destination_prefix_list_id = ""
      egress_only_gateway_id     = ""
      gateway_id                 = ""
      instance_id                = ""
      ipv6_cidr_block            = ""
      local_gateway_id           = ""
      network_interface_id       = ""
      transit_gateway_id         = ""
      vpc_endpoint_id            = ""
      vpc_peering_connection_id  = ""
    },
  ]

  tags = {
    Name = "saral_ekstep_private"
  }
}

resource "aws_route_table" "saral_ekstep_public" {
  vpc_id = aws_vpc.saral_ekstep_vpc.id

  route = [
    {
      cidr_block                 = "0.0.0.0/0"
      gateway_id                 = aws_internet_gateway.saral_ekstep_igw.id
      nat_gateway_id             = ""
      carrier_gateway_id         = ""
      destination_prefix_list_id = ""
      egress_only_gateway_id     = ""
      instance_id                = ""
      ipv6_cidr_block            = ""
      local_gateway_id           = ""
      network_interface_id       = ""
      transit_gateway_id         = ""
      vpc_endpoint_id            = ""
      vpc_peering_connection_id  = ""
    },
  ]

  tags = {
    Name = "saral_ekstep_public"
  }
}

resource "aws_route_table_association" "saral_ekstep_private-ap-south-1a" {
  subnet_id      = aws_subnet.saral_ekstep_private-ap-south-1a.id
  route_table_id = aws_route_table.saral_ekstep_private.id
}

resource "aws_route_table_association" "saral_ekstep_private-ap-south-1b" {
  subnet_id      = aws_subnet.saral_ekstep_private-ap-south-1b.id
  route_table_id = aws_route_table.saral_ekstep_private.id
}

resource "aws_route_table_association" "saral_ekstep_public-ap-south-1a" {
  subnet_id      = aws_subnet.saral_ekstep_public-ap-south-1a.id
  route_table_id = aws_route_table.saral_ekstep_public.id
}

resource "aws_route_table_association" "saral_ekstep_public-ap-south-1b" {
  subnet_id      = aws_subnet.saral_ekstep_public-ap-south-1b.id
  route_table_id = aws_route_table.saral_ekstep_public.id
}
