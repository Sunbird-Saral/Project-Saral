resource "aws_iam_role" "saral_ekstep" {
  name = "eks-cluster-saral_ekstep"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "eks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "saral_ekstep-AmazonEKSClusterPolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.saral_ekstep.name
}

variable "cluster_name" {
  default = "saral_ekstep"
  type = string
  description = "AWS EKS CLuster Name"
  nullable = false
}

resource "aws_eks_cluster" "saral_ekstep" {
  name     = var.cluster_name
  role_arn = aws_iam_role.saral_ekstep.arn

  vpc_config {
    subnet_ids = [
      aws_subnet.saral_ekstep_private-ap-south-1a.id,
      aws_subnet.saral_ekstep_private-ap-south-1b.id,
      aws_subnet.saral_ekstep_public-ap-south-1a.id,
      aws_subnet.saral_ekstep_public-ap-south-1b.id
    ]
  }

  depends_on = [aws_iam_role_policy_attachment.saral_ekstep-AmazonEKSClusterPolicy]
}
