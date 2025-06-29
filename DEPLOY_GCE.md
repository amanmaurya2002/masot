# Deploying to Google Cloud Compute Engine (GCE)

This guide provides step-by-step instructions for deploying the MASOT application to a Google Cloud Compute Engine instance using a self-contained Docker Compose setup.

This setup mirrors the local development environment but adds a secure Nginx reverse proxy for production.

## Prerequisites

1.  A Google Cloud Platform (GCP) project.
2.  `gcloud` CLI installed and authenticated on your local machine.
3.  Your application code pushed to a GitHub repository.

---

## Step 1: Create and Configure the GCE Instance

1.  **Create the VM Instance:**
    *   Navigate to the "VM instances" page in the Compute Engine section.
    *   Click "Create Instance".
    *   Give it a name (e.g., `masot-vm`).
    *   Choose a region and zone close to your users.
    *   Select the **e2-medium** machine type (2 vCPUs, 4 GB memory) as a good starting point.
    *   In the "Firewall" section, check **Allow HTTP traffic**. HTTPS traffic can be configured later with a domain name and certificates.
    *   Click "Create".

2.  **Reserve a Static External IP:**
    *   Navigate to "VPC network" -> "IP addresses".
    *   Find the external IP address of your `masot-vm` instance and change its "Type" from "Ephemeral" to "Static".

---

## Step 2: Create and Use a Startup Script

A startup script runs automatically when the VM is created or restarted. This will automate our entire deployment.

1.  **Prepare the Startup Script:**
    Create a file named `startup-script.sh` on your local machine with the following content. **The only thing you need to change is the `GITHUB_REPO_URL` if yours is different.**

    ```bash
    #!/bin/bash
    
    # Exit immediately if a command exits with a non-zero status.
    set -e
    
    # Log everything to a file
    exec > >(tee /var/log/startup-script.log|logger -t startup-script -s 2>/dev/console) 2>&1
    
    echo "Starting deployment startup script..."
    
    # --- UPDATE THIS VARIABLE IF NEEDED ---
    export GITHUB_REPO_URL="https://github.com/amanmaurya2002/masot.git"
    # ---
    
    # --- Install Git, Docker, and Docker Compose
    echo "Updating packages and installing dependencies..."
    apt-get update
    apt-get install -y git docker.io docker-compose
    
    # --- Start and enable Docker
    systemctl start docker
    systemctl enable docker
    
    # --- Clone the repository
    echo "Cloning the application repository..."
    cd /opt
    git clone $GITHUB_REPO_URL
    cd masot
    
    # --- Create the .env file for production Docker Compose
    echo "Creating .env file for secrets..."
    cat > .env << EOF
    # PostgreSQL Database Configuration
    DB_USER=masot_user
    DB_PASSWORD=masot_password
    DB_NAME=masot_db
    
    # Backend Secret Key (auto-generated)
    SECRET_KEY=$(openssl rand -hex 32)
    EOF
    
    # --- Build and run the application with Docker Compose
    echo "Building and running Docker containers for production..."
    # This command merges the base and production configs
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
    
    echo "Deployment script finished successfully!"
    ```

2.  **Add the Startup Script to your VM:**
    *   **STOP** your `masot-vm` instance if it's running.
    *   Click on the instance name to go to the details page, then click "Edit".
    *   Scroll down to the "Metadata" section.
    *   Add a new metadata key:
        *   **Key:** `startup-script`
        *   **Value:** Paste the entire content of your `startup-script.sh` here.
    *   Save the changes.

3.  **Start your VM:**
    *   Start the `masot-vm` instance. The startup script will run automatically.

---

## Step 3: Verify Deployment

1.  **Check Logs:** You can SSH into your VM or view the serial port output in the GCP console to monitor the startup script's progress. The log file is at `/var/log/startup-script.log`.

2.  **Access the Application:**
    *   Once the script is finished (it may take 5-10 minutes for Docker to build the images), open a web browser and navigate to your GCE instance's static external IP address.
    *   You should see the MASOT frontend, served securely via the Nginx proxy.

Your application is now deployed!

## Local Development Flow

Your local development flow is now completely separate and unaffected. Simply run:
`docker-compose up`
This will use the `docker-compose.yml` file, which has all your local settings, including live-reloading. The production file (`docker-compose.prod.yml`) will only be used on the server. 