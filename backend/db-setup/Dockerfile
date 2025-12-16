FROM mysql:8.0

# Set container OS timezone
ENV TZ=America/Chicago

# Copy timezone config into the image
COPY ./timezone.cnf /etc/mysql/conf.d/timezone.cnf

# Fix permissions so MySQL will NOT ignore it
RUN chmod 644 /etc/mysql/conf.d/timezone.cnf
