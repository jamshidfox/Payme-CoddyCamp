CURRENT_DIR=$(shell pwd)

APP=$(shell basename ${CURRENT_DIR})

APP_CMD_DIR=${CURRENT_DIR}/cmd

TAG=latest
ENV_TAG=latest

# Including
include .build_info

run:
	docker-compose -f docker-compose.yml up --force-recreate

test:
	docker-compose -f docker-compose.test.yml up --force-recreate

config:
	docker-compose -f docker-compose.yml config

build:
	CGO_ENABLED=0 GOOS=linux go build -mod=vendor -a -installsuffix cgo -o ${CURRENT_DIR}/bin/app ${APP_CMD_DIR}/main.go

proto-gen:
	./scripts/gen-proto.sh	${CURRENT_DIR}

pull-proto-module:
	git submodule update --init --recursive && rm -rf local_protos && mkdir "local_protos" && cp -R protos/* ./local_protos

update-proto-module:
	git submodule update --remote --merge && rm -rf local_protos && mkdir "local_protos" && cp -R protos/* ./local_protos

clear:
	rm -rf ${CURRENT_DIR}/bin/*

network:
	docker network create --driver=bridge ${NETWORK_NAME}

migrate-up:
	docker run --mount type=bind,source="${CURRENT_DIR}/migrations,target=/migrations" --network ${NETWORK_NAME} migrate/migrate \
		-path=/migrations/ -database=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?sslmode=disable up

migrate-down:
	docker run --mount type=bind,source="${CURRENT_DIR}/migrations,target=/migrations" --network ${NETWORK_NAME} migrate/migrate \
		-path=/migrations/ -database=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?sslmode=disable down

build-image:
	docker build --build-arg APP=${APP} --rm -t ${REGISTRY}/${PROJECT_NAME}/${APP}:${TAG} .
	docker tag ${REGISTRY}/${PROJECT_NAME}/${APP}:${TAG} ${REGISTRY}/${PROJECT_NAME}/${APP}:${ENV_TAG}

push-image:
	docker push ${REGISTRY}/${PROJECT_NAME}/${APP}:${TAG}
	docker push ${REGISTRY}/${PROJECT_NAME}/${APP}:${ENV_TAG}

swag-init:
	swag init -g api/main.go -o api/docs

.PHONY: proto
