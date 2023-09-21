resource "aws_iam_role" "saral_ekstep_nodes" {
  name = "eks-node-group-saral_ekstep_nodes"

  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
    Version = "2012-10-17"
  })
}

resource "aws_iam_role_policy_attachment" "saral_ekstep_nodes-AmazonEKSWorkerNodePolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.saral_ekstep_nodes.name
}

resource "aws_iam_role_policy_attachment" "saral_ekstep_nodes-AmazonEKS_CNI_Policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.saral_ekstep_nodes.name
}

resource "aws_iam_role_policy_attachment" "saral_ekstep_nodes-AmazonEC2ContainerRegistryReadOnly" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.saral_ekstep_nodes.name
}

resource "aws_eks_node_group" "private-saral_ekstep_nodes" {
  cluster_name    = aws_eks_cluster.saral_ekstep.name
  node_group_name = "private-saral_ekstep_nodes"
  node_role_arn   = aws_iam_role.saral_ekstep_nodes.arn

  subnet_ids = [
    aws_subnet.saral_ekstep_private-ap-south-1a.id,
    aws_subnet.saral_ekstep_private-ap-south-1b.id
  ]

  capacity_type  = "ON_DEMAND"
  instance_types = ["c5a.2xlarge"]

  scaling_config {
    desired_size = 2
    max_size     = 4
    min_size     = 1
  }

  update_config {
    max_unavailable = 1
  }

  labels = {
    role = "general"
  }

  # taint {
  #   key    = "team"
  #   value  = "devops"
  #   effect = "NO_SCHEDULE"
  # }

  # launch_template {
  #   name    = aws_launch_template.eks-with-disks.name
  #   version = aws_launch_template.eks-with-disks.laekstep_version
  # }

  depends_on = [
    aws_iam_role_policy_attachment.saral_ekstep_nodes-AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.saral_ekstep_nodes-AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.saral_ekstep_nodes-AmazonEC2ContainerRegistryReadOnly,
  ]
}

 resource "aws_launch_template" "eks-saral-ekstep-with-disks" {
   name = "eks-saral-ekstep-with-disks"

   key_name = "local-provisioner"

   block_device_mappings {
     device_name = "/dev/xvdb"

     ebs {
       volume_size = 100
       volume_type = "gp2"
     }
   }
 }
