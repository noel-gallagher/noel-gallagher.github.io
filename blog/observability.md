# Observability

- the ability to understand a system by examining it’s outputs
- metrics
- logs
- traces
  faster troubleshooting

---

# Monitoring

- Raise an alarm when something goes wrong
- Know ahead of time the metrics or events we are interested in

---

# What do we want to monitor?

- thing 1
- thing 2

---

# What do we want to alert on?

- Thing 1
- Thing 2

---

# Logs

Capturing detailed information

- record events
- errors
- provide contextual data

---

# ELK stack

- Elasticsearch for search
- Logstash for collecting and aggregating logs
- Kibana for visualisation

---

# Distributed Tracing

Ability to track end-to-end an action

- Spans: a logical operation
- Traces: multiple spans

For example: A user submits a request which travels through many backend services

The request goes from A->B->C, each service A,B,C is an individual span, while a trace could be A->B or A->C or B-C

---

# Grafana

- used for displaying data
- alerting
- monitor infra
- reduce time to find issues
- view trends in data

---

# Prometheus:

collects and stores metrics as time series data

- typically application exposes metrics via endpoint

---

![prometheus architecture](https://prometheus.io/assets/architecture.png)

---

# Core metrics:

### counter: incremental

- example: number of requests
- tasks completed
- errors reported

### guage: increase/decrease (ie cpu usage, memory usage, dynamic data)

- items in a queue
- disk space used

### histogram: distribution of values (ie latency P95, P98, P99)

- request durations
- response sizes`

---

# Integration

- Define what you want to expose (request counts, error rates, response times...)
- start metric collection in application
- (most usecases) start http server which exposes these metrics
- prometheus will scrape this endpoint
- grafana will query promethus to display content
