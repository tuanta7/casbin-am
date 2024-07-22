FROM golang:latest as builder

RUN mkdir /app
WORKDIR /app

COPY go.mod go.sum ./
COPY model.conf ./
RUN go mod download 
RUN go mod verify

COPY . .
RUN CGO_ENABLED=0 go build -v -o auth ./
RUN chmod +x /app/auth

FROM alpine:latest
RUN mkdir /app
COPY --from=builder /app/auth /app
COPY --from=builder /app/model.conf /app

EXPOSE 8000

CMD ["/app/auth"]