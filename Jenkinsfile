pipeline {
  agent { 
        label 'docker' 
   }

  stages {
    stage("build-backend") {
      agent{
        dockerfile {
            filename 'Dockerfile'
            dir './v1.0/backend'
            //label '1.0-latest'
            additionalBuildArgs  '--build-arg PORT=3000'
            //args '-v /tmp:/tmp'
        }
      }
        steps {
          script { 
              if (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'v1') {
                  echo 'WIP....'
              } else if (env.BRANCH_NAME == 'feature/v1-devops') {
                  def backendImg = docker.build("saral-backend:${env.BUILD_ID}", "./v1.0/backend")
                  backendImg.inside {
                        sh 'ls -l'
                    }
              }
          }
        }
    }
 }
}
