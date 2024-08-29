#FROM node:16-alpine as build

#WORKDIR /app

#COPY package*.json ./
#RUN npm install

#COPY . .

#RUN npm run build
#FROM nginx:alpine

#COPY --from=build /app/build /usr/share/nginx/html
#COPY nginx.conf /etc/nginx/conf.d/default.conf

#EXPOSE 443
#CMD ["nginx", "-g", "daemon off;"]


FROM nginx:alpine

# Copy the existing build directory to the nginx html directory
COPY build /usr/share/nginx/html

# Copy your SSL certificates to the appropriate directory in the container
COPY ssl /etc/nginx/ssl

# Copy your custom nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
