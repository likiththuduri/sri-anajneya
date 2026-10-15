# Multi-stage Docker build for Sri Anjaneya Store Spring Boot Backend
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cap Maven memory for free-tier build runners
ENV MAVEN_OPTS="-Xmx400m -XX:+UseSerialGC"

COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests -B

# Production Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring \
    && mkdir -p /app/data /app/uploads /tmp \
    && chown -R spring:spring /app /tmp

USER spring:spring

COPY --from=build --chown=spring:spring /app/target/*.jar app.jar

ENV PORT=8080
ENV JAVA_OPTS="-Xmx384m -XX:+UseSerialGC"
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
