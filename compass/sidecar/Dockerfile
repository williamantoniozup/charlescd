FROM golang:1.14-alpine as builder

RUN apk update && apk add gcc libc-dev git

WORKDIR /app/sidecar

COPY ./go.mod .
COPY ./go.sum .

RUN go mod download

COPY . .

RUN go build -o ./out/sidecar cmd/*.go

# -----------------------------------------------

FROM alpine:3.12.0

COPY --from=builder /app/sidecar/out/sidecar .

EXPOSE 8080

ENTRYPOINT ["./sidecar"]
