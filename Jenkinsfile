pipeline {
  agent any

  stages {
    stage("build-backend") {
        steps {
          script { 
              if (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'v1') {
                  echo 'WIP....'
              } else if (env.BRANCH_NAME == 'feature/v1-devops') {
                  echo 'Backend npm build'
              }
          }
        }
    }
 }
}
