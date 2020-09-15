package action

type webhook struct {
	Url     string            `json:"url"`
	Headers map[string]string `json:"headers"`
}

type BaseActionConfiguration struct {
	Webhook webhook
}
