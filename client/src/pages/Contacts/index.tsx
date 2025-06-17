import styles from "./styles.module.scss";

const Contacts = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Contact Us</h1>
        <p>
          We'd love to hear from you! Whether you have a question about our
          menu, need assistance with an order, or just want to provide feedback,
          feel free to reach out through any of the methods below.
        </p>

        <div className={styles.contact_methods}>
          <div className={styles.contact_method}>
            <h2>✉️ Email Us</h2>
            For support:
            <a href="mailto:support@vfood.com"> support@vfood.com</a>
          </div>

          <div className={styles.contact_method}>
            <h2>📞 Call Us</h2>
            <p>
              Customer Service: <br />{" "}
              <a href="tel:+375293102503">+375 (29) 310-25-03</a>
            </p>
          </div>

          <div className={styles.contact_method}>
            <h2>🏢 Visit Us</h2>
            <p>VFood</p>
            <p>Grodno, Ojeshko 22</p>
          </div>
        </div>
        <div className={styles.working_hours}>
          <strong>Working Hours:</strong> Monday – Sunday, 9:00 AM – 10:00 PM
        </div>

        <div className={styles.map}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2362.8759292388204!2d23.836899176532867!3d53.68483664934313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dfd623110c4309%3A0x91184a698fa7af27!2z0YPQuy4g0K3Qu9C40LfRiyDQntC20LXRiNC60L4gMjIsINCT0YDQvtC00L3Qviwg0JPRgNC-0LTQvdC10L3RgdC60LDRjyDQvtCx0LvQsNGB0YLRjCwg0JHQtdC70LDRgNGD0YHRjA!5e0!3m2!1sru!2sfr!4v1747165001607!5m2!1sru!2sfr"
            width="600"
            height="450"
            loading="lazy"
          ></iframe>
        </div>

        <div className={styles.socials}>
          <a
            href="https://instagram.com/vfood"
            target="_blank"
            rel="noreferrer"
          >
            📷
          </a>
          <a href="https://t.me/vfood" target="_blank" rel="noreferrer">
            💬
          </a>
          <a href="https://facebook.com/vfood" target="_blank" rel="noreferrer">
            📘
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
