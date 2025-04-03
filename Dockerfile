# Stage 1: Build the React application
FROM node:20.18-alpine AS build
WORKDIR /app
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci
# Copy application files
COPY . .
# Build the application
RUN npm run build

# Stage 2: Serve the built application with Nginx
FROM nginx:alpine
# Copy the build output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom Nginx config
COPY default.conf /etc/nginx/conf.d/default.conf
# Expose port 80
EXPOSE 80
# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]