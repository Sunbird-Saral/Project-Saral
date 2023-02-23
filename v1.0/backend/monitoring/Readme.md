1. Run Grafana docker container:
   ```
   docker run --rm -p 3001:3000 \
  -e GF_AUTH_DISABLE_LOGIN_FORM=true \
  -e GF_AUTH_ANONYMOUS_ENABLED=true \
  -e GF_AUTH_ANONYMOUS_ORG_ROLE=Admin \
  -v /Users/dileep.gadiraju/datasources.yml:/etc/grafana/provisioning/datasources/ \
  grafana/grafana:7.1.5
  ```
2. Open [Grafana dashboard](http://localhost:3001)
3. 