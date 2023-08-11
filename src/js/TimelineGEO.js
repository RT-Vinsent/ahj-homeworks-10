/* eslint-disable no-console */
export default class TimelineGEO {
  constructor() {
    this.geo = null;
    this.status = false;
  }

  checkSupportGEO() {
    if (navigator.geolocation) { this.status = true; }
  }

  async getPosition() {
    if (!this.status) { return false; }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (data) => {
            const { latitude, longitude } = data.coords;
            resolve({ latitude, longitude, status: true });
          },
          (err) => {
            reject(err);
          },
          { enableHighAccuracy: true },
        );
      });
      return position;
    } catch (error) {
      return error;
    }
  }
}
