pipeline {
    agent any

    tools {
        jdk 'java21'
        nodejs 'NodeJS'
    }

    environment {
        COMPOSE_FILE     = 'docker-compose.yml'
        DOCKER_HUB_USER  = 'mahesh1925'
        BACKEND_IMAGE    = 'mahesh1925/lms-backend'
        FRONTEND_IMAGE   = 'mahesh1925/lms-frontend'
    }

    stages {

        /* 🧭 Stage 1: Checkout Code */
        stage('Checkout Code') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/maheshpalakonda/LMS.git',
                    credentialsId: 'github-pat'
            }
        }

        /* 🔍 Stage 2: SonarQube Analysis */
        stage('Code Quality Scan - SonarQube') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    script {
                        def scannerHome = tool name: 'SonarScanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                        withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_AUTH_TOKEN')]) {
                            sh """
                                echo "🔍 Running SonarQube Analysis..."
                                export PATH="${scannerHome}/bin:\\$PATH"
                                sonar-scanner \
                                    -Dsonar.projectKey=lms-test \
                                    -Dsonar.sources=./backend,./frontend \
                                    -Dsonar.host.url=http://72.60.219.208:9000 \
                                    -Dsonar.login=${SONAR_AUTH_TOKEN}
                            """
                        }
                    }
                }
            }
        }

        /* 🏗️ Stage 3: Build Docker Images */
        stage('Build Docker Images') {
            steps {
                sh '''
                    echo "🏗️ Building Docker images..."
                    docker build -t ${BACKEND_IMAGE}:latest -f Dockerfile.backend .
                    docker build -t ${FRONTEND_IMAGE}:latest -f frontend/Dockerfile.frontend frontend
                '''
            }
        }

        /* 📦 Stage 4: Push Images to Docker Hub */
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "🔑 Logging into Docker Hub..."
                        echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin

                        echo "📤 Pushing images to Docker Hub..."
                        docker push ${BACKEND_IMAGE}:latest
                        docker push ${FRONTEND_IMAGE}:latest

                        echo "🔒 Logout from Docker Hub"
                        docker logout
                    '''
                }
            }
        }

        /* 🚀 Stage 5: Deploy Updated Containers (with .env injection) */
        stage('Deploy Containers') {
            steps {
                withCredentials([
                    file(credentialsId: 'backend-env', variable: 'BACKEND_ENV'),
                    file(credentialsId: 'frontend-env', variable: 'FRONTEND_ENV')
                ]) {
                    sh '''
                        echo "🔧 Stopping old containers..."
                        docker compose down || true

                        echo "🧩 Injecting .env files for backend & frontend..."
                        cp "$BACKEND_ENV" backend/.env
                        cp "$FRONTEND_ENV" frontend/.env

                        echo "🧱 Updating docker-compose.yml to use latest images..."
                        sed -i "s|image:.*lms-backend.*|image: ${BACKEND_IMAGE}:latest|g" docker-compose.yml || true
                        sed -i "s|image:.*lms-frontend.*|image: ${FRONTEND_IMAGE}:latest|g" docker-compose.yml || true

                        echo "🚀 Starting updated containers..."
                        docker compose up -d --force-recreate --remove-orphans

                        echo "✅ Deployment completed successfully!"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Build passed and images pushed to Docker Hub!"
            echo "Frontend image: ${FRONTEND_IMAGE}:latest"
            echo "Backend image:  ${BACKEND_IMAGE}:latest"
        }
        failure {
            echo "❌ Build failed — check Jenkins logs."
        }
    }
}

