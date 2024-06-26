# Lucia Auth Implementation

This project demonstrates how to implement authentication using [Lucia auth](https://lucia-auth.com) with password and email. It handles user sign-in, sign-up, and sign-out processes, and utilizes Docker to create a local PostgreSQL database.

### How to Run the Project
1. #### Clone the Repository
    ```sh
    git clone https://github.com/yourusername/lucia-auth.git
    cd lucia-auth
    ```

2. #### Set Up Docker Containers for Database
> [!WARNING]
> Skip this step, if you are using actual DB, just provide the DB URL in the .env file

```sh
docker-compose up -d
```
- Navigate to [http://localhost:5050](http://localhost:5050).
- Login using the Email and Password defined in the `docker-compose.yaml` file.
- Register a server with the following details:
    - **Name**: `postres_db`
    - **Hostname/Address**: `postgres`
    - **Port**: `5432`
    - **Username**: `<your-username in docker-compose file>`
    - **Password**: `<your-password in docker-compose file>`
- Use the following images as reference for setup:
    - ![Screenshot_26-6-2024_202346_localhost](https://github.com/othman2408/lucia-auth/assets/49313147/036ffc6e-715d-45eb-8fae-be10ca977e2d) 
    - ![Screenshot_26-6-2024_20253_localhost](https://github.com/othman2408/lucia-auth/assets/49313147/d8759035-eb80-458d-ae16-6b8d303132ac)

3. #### Install Dependencies
    ```sh
    pnpm install
    ```

4. #### Generate Database Migrations
    ```sh
    pnpm db:generate
    ```

5. #### Apply Database Migrations
    ```sh
    pnpm db:migrate
    ```

6. #### Open Drizzle Studio
    ```sh
    pnpm db:studio
    ```

7. #### Start the Development Server
    ```sh
    pnpm run dev
    ```
