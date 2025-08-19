{
  "Servers": {
    "1": {
      "Name": "Postgres",
      "Group": "Servers",
      "Host": "db",
      "Port": 5432,
      "Username": "${POSTGRES_USER}",
      "Password": "${POSTGRES_PASSWORD}",
      "SSLMode": "prefer",
      "MaintenanceDB": "${POSTGRES_DB}"
    }
  }
}