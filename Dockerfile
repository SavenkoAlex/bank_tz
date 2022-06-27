FROM node:gallium
WORKDIR /opt/app
RUN adduser app

RUN chown -R app /opt/app
USER app
EXPOSE 3000
CMD ["npm" "run" "start"]
