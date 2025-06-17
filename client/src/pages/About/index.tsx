import styles from "./styles.module.scss";

const About = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>About VFood</h1>
        <p>
          Welcome to VFood, your number one source for delicious meals delivered
          right to your doorstep. We're dedicated to giving you the very best of
          culinary delights, with a focus on quality, customer service, and
          uniqueness.
        </p>
        <p>
          Founded in 2025 by [Founder's Name], VFood has come a long way from
          its beginnings in [Starting Location]. When [Founder's Name] first
          started out, their passion for [Brand Message - e.g., "eco-friendly
          food preparation"] drove them to [Action - e.g., "do intense research,
          quit her day job"], and gave them the impetus to turn hard work and
          inspiration into to a booming online restaurant.
        </p>
        <p>
          We now serve customers all over the world, and are thrilled to be a
          part of the quirky wing of the food industry.
        </p>
        <p>
          We hope you enjoy our products as much as we enjoy offering them to
          you. If you have any questions or comments, please don't hesitate to
          contact us.
        </p>
        <p>Sincerely,</p>
        <p>The VFood Team</p>
      </div>
    </div>
  );
};

export default About;
