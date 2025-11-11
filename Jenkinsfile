pipeline {
    agent any

    environment {
        // Docker Hub
        DOCKER_USER = 'mahesh1925'
        DOCKER_BACKEND_IMAGE = "${DOCKER_USER}/lms-backend:latest"
        DOCKER_FRONTEND_IMAGE = "${DOCKER_USER}/lms-frontend:latest"

        // Paths and files
        COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {

        /* --------------------------------------------------
         * 1. Checkout from GitHub
         * -------------------------------------------------- */
        stage('Checkout Code') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/maheshpalakonda/lms-ci_cd.git',
                    credentialsId: 'github-pat'
            }
        }

        /* --------------------------------------------------
         * 2. Build Docker Images
         * -------------------------------------------------- */
        stage('Build Docker Images') {
            steps {
                echo '🏗️ Building Docker images...'

                sh '''
                docker build -t ${DOCKER_BACKEND_IMAGE} -f backend/Dockerfile.backend backend
                docker build -t ${DOCKER_FRONTEND_IMAGE} -f frontend/Dockerfile.frontend frontend
                '''
            }
        }

        /* --------------------------------------------------
         * 3. Push to Docker Hub
         * -------------------------------------------------- */
        stage('Push to Docker Hub') {
            environment {
                DOCKER_PASS = credentials('docker-hub-pass')
            }
            steps {
                echo '🔑 Logging into Docker Hub...'
                sh '''
                echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                docker push ${DOCKER_BACKEND_IMAGE}
                docker push ${DOCKER_FRONTEND_IMAGE}
                docker logout
                '''
            }
        }

        /* --------------------------------------------------
         * 4. Deploy Containers via Docker Compose
         * -------------------------------------------------- */
        stage('Deploy Containers') {
            environment {
                BACKEND_ENV = credentials('backend-env')
                FRONTEND_ENV = credentials('frontend-env')
            }
            steps {
                echo '🧩 Deploying containers...'
                sh '''
                mkdir -p /app/lms

                # Copy environment files from Jenkins credentials
                cp $BACKEND_ENV backend/.env || true
                cp $FRONTEND_ENV frontend/.env || true

                echo "🧹 Cleaning up old containers..."
                docker rm -f lms-backend lms-frontend || true

                echo "♻️ Restarting containers via Docker Compose..."
                docker compose -f ${COMPOSE_FILE} down || true
                docker compose -f ${COMPOSE_FILE} up -d --force-recreate --remove-orphans

                echo "✅ Deployment successful!"
                '''
            }
        }
    }

    /* --------------------------------------------------
     * 5. Post Actions
     * -------------------------------------------------- */
    post {
        success {
            echo '✅ Build and Deployment Completed Successfully!'
        }
        failure {
            echo '❌ Build Failed — Check Jenkins Logs.'
        }
    }
}

