module.exports = {
  apps : [{
    name   : "meat-api-2",
    script : "./dist/main.js",
		instances: 2,
		exec_mode: "cluster",
		watch: true,
		merge_logs: true,
		env: {
			PORT: 5000,
			DB_URL: 'mongodb://localhost/meat-api-2',
			NODE_ENV: "development"
		},
		env_production: {
			PORT: 5001,
			NODE_ENV: "production"
		}
  }]
}
