import { FiHeart } from 'react-icons/fi'
import styles from '../styles/Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        Feito com <FiHeart className={styles.heartIcon} /> para os amantes de versos e poesias © {new Date().getFullYear()}
      </p>
    </footer>
  )
}