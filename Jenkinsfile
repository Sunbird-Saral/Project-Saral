pipeline {
  agent any

  stages {
    stage("build-backend") {
        steps {
          script { 
              if (env.BRANCH_NAME != 'main' && env.BRANCH_NAME != 'staging') {
                  echo 'This is not master or staging'
              } else {
                  echo 'things and stuff'
              }
          }
        }
    }
 }
}
