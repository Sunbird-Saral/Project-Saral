resource "aws_iam_role" "saral" {
  name = "eks-cluster-saral"

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

resource "aws_iam_role_policy_attachment" "saral-AmazonEKSClusterPolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.saral.name
}

variable "cluster_name" {
  default = "saral"
  type = string
  description = "AWS EKS CLuster Name"
  nullable = false
}

resource "aws_eks_cluster" "saral" {
  name     = var.cluster_name
  role_arn = aws_iam_role.saral.arn

  vpc_config {
    subnet_ids = [
      aws_subnet.saral_private-ap-south-1a.id,
      aws_subnet.saral_private-ap-south-1b.id,
      aws_subnet.saral_public-ap-south-1a.id,
      aws_subnet.saral_public-ap-south-1b.id
    ]
  }

  depends_on = [aws_iam_role_policy_attachment.saral-AmazonEKSClusterPolicy]
}
