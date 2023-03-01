1. Run prometheus
   ```
   docker run -p 9090:9090 -v /Users/dileep.gadiraju/projects/saral/Project-Saral/v1.0/backend/monitoring/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus
   ```
2. Run Grafana docker container:
   ```
   docker run --rm -p 3001:3000 \
  -e GF_AUTH_DISABLE_LOGIN_FORM=true \
  -e GF_AUTH_ANONYMOUS_ENABLED=true \
  -e GF_AUTH_ANONYMOUS_ORG_ROLE=Admin \
  -v /Users/dileep.gadiraju/projects/saral/Project-Saral/v1.0/backend/monitoring/datasources.yml:/etc/grafana/provisioning/datasources/datasources.yml \
  grafana/grafana:7.1.5
  ```
1. Open [Grafana dashboard](http://localhost:3001)
2. Navigate to Manage Dashboards and import dashboard Id 7587, 11175, 11529 , 13659
3. 