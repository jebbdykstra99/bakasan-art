// ════════════════════════════════════════════════════════════════
// BAKASAN — PAINTINGS DATA FILE
// ════════════════════════════════════════════════════════════════
//
// HOW TO ADD A NEW PAINTING
// ─────────────────────────
// 1. Copy the photo to the right folder under images/paintings/:
//      Women of Buddhism   → images/paintings/women-of-buddhism/
//      Buddhist Iconography→ images/paintings/buddhist-iconography/
//      Asian Ladies        → images/paintings/asian-ladies/
//      Fragments of Nature → images/paintings/fragments-of-nature/
//
// 2. Add one entry to PAINTINGS_DATA below (copy the template
//    at the bottom of this file).
//
// 3. Open GitHub Desktop → Commit → Push → live in 60 seconds.
//
// FIELDS
// ──────
//  id           Unique ID, lowercase, hyphens only. Must match
//               the image filename (minus the extension).
//  category     'women' | 'iconography' | 'asian-ladies' | 'nature'
//  title        Painting title shown in nav and gallery
//  captionTitle Full display title under the painting image
//  era          Historical period (e.g. '10th Century'). Optional.
//  year         'Bakasan, 1992' — leave blank if unknown
//  medium       e.g. 'Acrylic on Canvas'
//  size         e.g. '24″ × 36″'
//  file         Path relative to images/ folder
//  bodyHtml     Story / biography HTML. Use <p> tags.
//               Leave as empty string '' if not written yet.
// ════════════════════════════════════════════════════════════════

const PAINTINGS_DATA = [

  // ══════════════════════════════════════════════════════
  // WOMEN OF BUDDHISM
  // ══════════════════════════════════════════════════════

  {
    id: 'murasaki',
    category: 'women',
    title: 'Lady Murasaki Shikibu',
    captionTitle: 'Murasaki Shikibu By Candlelight',
    era: '10th Century',
    year: 'Bakasan, 1992',
    medium: 'Acrylic on Canvas',
    size: '20″ × 24″',
    file: 'paintings/women-of-buddhism/murasaki.png',
    bodyHtml: `
      <p>Sprung from royalty, Murasaki Shikibu is Japan's greatest writer. She authored one of the world's greatest novels entitled <em>The Tale of Genji</em>. Her use of the novel as a form of literature precedes its use in the West or even China by hundreds of years. The power of the <em>Tale of Genji</em> remains true even in its present English translation. To this day, the book is overwhelmingly considered one of the great novels of the world in any language. The greatness of Lady Murasaki's <em>Tale of Genji</em> generally overshadows her poetry, however, the novel uniquely intersplices prose and poetry throughout. Two poems by the main characters as shown below form the pivot upon which the story turns.</p>
      <div class="poem-grid">
        <div class="poem">
          <p class="poem-speaker">Lady Murasaki says:</p>
          <p class="poem-lines">The troubled waters<br>are frozen fast.<br>Under clear heaven<br>moonlight and shadow<br>ebb and flow.</p>
        </div>
        <div class="poem">
          <p class="poem-speaker">Prince Genji responds:</p>
          <p class="poem-lines">The memories of long love<br>Gather like drifting snow.<br>Poignant as the mandarin ducks<br>who float side by side in sleep.</p>
        </div>
      </div>`
  },

  {
    id: 'okoi',
    category: 'women',
    title: 'Okoi (The Geisha)',
    captionTitle: 'Okoi (The Geisha)',
    era: '20th Century',
    year: 'Bakasan, 1994',
    medium: 'Acrylic on Canvas',
    size: '24″ × 36″',
    file: 'paintings/women-of-buddhism/okoi.jpg',
    bodyHtml: `
      <p>Born into poverty, Okoi's family could not afford to keep her. Hoping for a better life, her mother gave her to a wealthy family. They suffered a misfortune and also couldn't keep her, so they gave her to a Geisha. The Geisha found this young child to be bright and beautiful, so she taught her the nuances of poetry, the steps of dance, the joy of music and the sophistication of conversation. After training her, the Geisha gave her the name of Okoi. Okoi began working professionally as a Geisha. Due to the costliness of the elaborate robes and kimonos, each Geisha required a sponsor. She won the Prime Minister's sponsorship.</p>
      <p>During the Sino-Russian war, the Prime Minister was accused of being a traitor. Okoi found her home surrounded by troops and was told she must leave. Even so, Okoi's reputation grew. She met a popular actor of the day. They married, but it was not a happy one. He abandoned her, so she left and built the most important teahouse in Japan. During this time, Go-go clubs became popular. So she built the most popular Go-go club in the country. Then a devastating earthquake destroyed it. After this catastrophe, she entered the Buddhist nunnery. She passed in 1946. At her temple, patrons erected a statue entitled Okoi Kannon in honor of her.</p>`
  },

  {
    id: 'niijo',
    category: 'women',
    title: 'Lady Niijo',
    captionTitle: 'Lady Niijo',
    era: '13th Century',
    year: 'Bakasan, 1995',
    medium: 'Acrylic on Canvas',
    size: '18″ × 24″',
    file: 'paintings/women-of-buddhism/Niijo.jpg',
    bodyHtml: `
      <p>Lady Niijo stands out in Japanese history as one of the most intriguing and compelling women of all time. As a child of twelve, the Emperor adopted her as his child. Their complete relationship remains a mystery, but it is believed he made her his lover as well. As with many other women of her era, life in the royal court enabled her to become an expert calligrapher, painter and poet. At a young age, she took vows as an Ama (a Buddhist nun). From that time, she wandered the country from royal palaces to holy temples. As an Ama, she was privileged to pass through any area and upon arriving at a temple, she would receive food and lodging.</p>
      <p>During one trip, she happened upon a palace run by a powerful warlord. While staying in his quarters, she painted a mural on one of his main walls. The magnificence of it left him stunned and enamored. He was so taken by her that he offered her his hand in marriage. She declined. That night she left the palace under stealth of night. Upon discovering her absence, he declared her a thief and sent out his best troops to find her and bring her back. She, of course, escaped.</p>`
  },

  {
    id: 'rengetsu',
    category: 'women',
    title: 'The Nun Rengetsu',
    captionTitle: 'Nun Rengetsu (Lotus Moon)',
    era: '19th Century',
    year: 'Bakasan, 1996',
    medium: 'Acrylic on Canvas',
    size: '18″ × 24″',
    file: 'paintings/women-of-buddhism/NunRengetsu.jpg',
    bodyHtml: `
      <p>Beneath the echoes of the temple bell, among the shadows, warm laughter and incense, an unknown samurai entered a lady of the stream. From their dance of joy, issued a wondrous flower to become known as Rengetsu. A Pure Land Buddhist priest adopted her and made her a child of the temple. She learned two forms of martial arts, read the great works of literature, studied the great painters, learned calligraphy and became an expert at the game of <em>Go</em> (a Japanese form of chess). By the time Rengetsu reached sixteen years old, she was just as adept at disarming intruders with her looks as she was with her martial arts. She had already established herself as one of Kyoto's better tanka poets as well as calligraphy masters. Although she was a <em>Go</em> master, she could not teach it because she was a woman.</p>
      <p>Rengetsu chose to make pottery inscribed with her poetry in her masterful calligraphy. It was said that all of Kyoto had a few pieces of Rengetsu's <em>yaki-style</em> pottery at one time. She was such a celebrity that she once had to move thirteen times in one year to avoid art patrons. Lotus Moon is legendary for giving all her extra earnings to equally impoverished poets and writers so that they could continue their works of art. Another legend has an intruder breaking into Rengetsu's hut. The sleeping Rengetsu awakened and said, "You won't find anything of value here, but you are welcome to whatever you need. You must be starving to be so desperate. Let me fix you a bowl of tea-rice."</p>`
  },

  {
    id: 'gotami',
    category: 'women',
    title: 'Mahaprajapati Gotami',
    captionTitle: 'Mahaprajapati Gotami, The Buddha\'s Aunt',
    era: 'Circa 500 BCE',
    year: 'Bakasan, 1989',
    medium: 'Acrylic on Canvas',
    size: '24″ × 36″',
    file: 'paintings/women-of-buddhism/Mahapajapati.jpg',
    bodyHtml: `
      <p>Mahaprajapati Gotami was the sister of Queen Maya, the Mother of the Buddha. Both women were members of the King's harem. After the Buddha's enlightenment, Mahaprajapati Gotami pleaded with her nephew, the Buddha to allow her form the first order of nuns. Originally, the Buddha was hesitant to allow her to do so, but with the help of Ananda, the Buddha allowed her to do so. Thereafter Mahaprajapati Gotami achieved enlightenment.</p>`
  },

  {
    id: 'nukada',
    category: 'women',
    title: 'Princess Nukada',
    captionTitle: 'Princess Nukada',
    era: '7th Century',
    year: 'Bakasan, 1993',
    medium: 'Acrylic on Canvas',
    size: '20″ × 24″',
    file: 'paintings/women-of-buddhism/Princess_Nukada.jpg',
    bodyHtml: `
      <p>Princess Nukada lived in the latter half of the 7th Century. As a child of royalty, she was a sought after woman. Nevertheless it was her poetry which won her the heart of the Emperor Temmu. Historically, Princess Nukada is regarded as the greatest poet of the Omi period. During the seventh century, Buddhism was just making its way into Japanese culture. In her poetry, she speaks most highly of Autumn. This is significant because in Japan, Spring is the most revered season, yet Nukada was the child of Fall.</p>`
  },

  {
    id: 'tibetan',
    category: 'women',
    title: 'Tibetan Celestial Dancer',
    captionTitle: 'Tibetan Celestial Dancer',
    era: '20th Century',
    subtitle: '(Anonymous Woman)',
    year: 'Bakasan, 1994',
    medium: 'Acrylic on Canvas',
    size: '24″ × 36″',
    file: 'paintings/women-of-buddhism/Tibetan_Celestial_Dancer.jpg',
    bodyHtml: ''
  },

  {
    id: 'siam',
    category: 'women',
    title: 'Siam Temple Dancer',
    captionTitle: 'Siam (Thailand) Temple Dancer',
    era: '20th Century',
    year: 'Bakasan, 1992',
    medium: 'Acrylic on Canvas',
    size: '24″ × 36″',
    file: 'paintings/women-of-buddhism/Siam_Temple_Dancer.jpg',
    bodyHtml: ''
  },

  // ══════════════════════════════════════════════════════
  // BUDDHIST ICONOGRAPHY
  // ══════════════════════════════════════════════════════

  {
    id: 'green-tara',
    category: 'iconography',
    title: 'Green Tara',
    captionTitle: 'Green Tara',
    year: 'Bakasan, 1989',
    medium: 'Acrylic on Canvas',
    size: '24″ × 36″',
    file: 'paintings/buddhist-iconography/GreenTara.jpg',
    bodyHtml: `
      <p>Arya Tara is one of many deities present in Buddhist iconography. Some worshippers still believe that if a practitioner chants her mantra of "Om Ta Re Tu Ta Re Tu Re Svaha" that their wishes will be granted. Some believe that the Boddhisattva, Green Tara, is based on an Indian Rani (Queen). Buddhist lore says that this "Mother of All Buddha's" was born from a single tear of compassion shed by Avalokitashvara upon seeing the suffering of all humanity. Innumerable versions of Tara have been portrayed in Buddhist iconography from Green Tara to Black Tara to White Tara to Wrathful Tara. Tara, as seen in this painting, helps her believers overcome obstacles in their lives and saves them when in distress.</p>
      <p>In this painting, the peacock protects Green Tara. The peacock represents purity as it can absorb the bite of venomous reptiles. Also seen in this painting is a moon with peacock feathers on its fringe. In Buddhist iconography, the moon represents enlightenment. As a Boddhisattva, Tara has attained enlightenment, yet has foregone nirvana so that she may guide others down the path to Pure Light.</p>`
  },

  {
    id: 'black-tara',
    category: 'iconography',
    title: 'Black Tara',
    captionTitle: 'Black Tara',
    year: 'Bakasan, 1988',
    medium: 'Acrylic on Canvas',
    size: '24″ × 36″',
    file: 'paintings/buddhist-iconography/BlackTara.png',
    bodyHtml: `
      <p>Tara and her one hundred and eight manifestations have both benevolent and wrathful qualities. Through all her different forms, she always represents compassion and liberation. Black Tara, as seen in this painting, represents a particularly malevolent manifestation. Her wrathful nature is not that of a demon or a vindictive goddess, but that of a fierce and intense deity that dispels the fear of death and fosters the evolution of compassion in those following her path.</p>`
  },

  {
    id: 'kuan-yin',
    category: 'iconography',
    title: 'Kuan Yin',
    captionTitle: 'Kuan Yin (Chinese)',
    year: 'Bakasan, 1987',
    medium: 'Acrylic on Canvas',
    size: '24″ × 36″',
    file: 'paintings/buddhist-iconography/Kuan-Yin.jpg',
    bodyHtml: `
      <p>Buddhism is built on the twin pillars of wisdom and compassion. In typical Buddhist iconography, the female form of Prajna usually symbolizes wisdom, whereas the male form of Avalokitashvara personifies compassion. In this painting, Kuan-Yin reveals himself as a Chinese version of Avalokitashvara, the Boddhisattva of compassion and love. As shown here, Boddhisattvas are usually adorned in Indian regalia. As time progressed, Avalokitashvara, as represented in China, gradually evolved into a graceful feminine form. In this painting, Kuan-Yin is shown becoming more human and fleshy.</p>
      <p>Here Kuan-Yin is seated in the royal "ease" of India. Typically the "royal ease" allowed one to find a position of comfort. Such a position is very representative of India, which never embraced the strict positions of the Far East.</p>`
  },

  {
    id: 'kannon',
    category: 'iconography',
    title: 'Kannon',
    captionTitle: 'Kannon (Japanese)',
    year: 'Bakasan, 1987',
    medium: 'Acrylic on Canvas',
    size: '24″ × 36″',
    file: 'paintings/buddhist-iconography/Kannon.jpg',
    bodyHtml: `
      <p>In this painting, Kannon reveals himself as the Japanese version of Avalokitashvara, the Boddhisattva of compassion and love. Here he is also shown dressed as Indian royalty. The two Kings of bright wisdom guard over him. Typical Buddhist iconography has many fierce creatures and demons, yet their role usually is that of a guardian or protector, not as tempter or conqueror. Traditional-style Chinese clouds surround Kannon. Kannon's hands are positioned in one of the hundreds of Buddhist mudras. The iconographic symbol of Kannon is the lotus flower. Here Kannon appears to be either growing out of the lotus or supported by the flower.</p>
      <p>In most representations, the Japanese version of Avalokitashvara typically is not as graceful and human as the Chinese version. In Japan, Kannon is represented as male or female, whereas in China, Kuan-Yin is usually female. One interpretation is that in Japanese Buddhism, the evolution of the Avalokitashvara was not as evolved as in Chinese Buddhism.</p>`
  },

  {
    id: 'amida',
    category: 'iconography',
    title: 'Amida Buddha',
    captionTitle: 'Amida Buddha (Japanese)',
    year: 'Bakasan, 1985',
    medium: 'Acrylic on Canvas',
    size: '24″ × 36″',
    file: 'paintings/buddhist-iconography/AmidaBuddah.jpg',
    bodyHtml: `
      <p>In Japan, one of the most compassionate sects of Buddhism remains Jodo Shinshu. In this style, the object of worship is Amida, the Buddha of Infinite Light and Life. Amida Buddha promises Universal Enlightenment for all beings. However, the Primal Vow of Amida is not concerned with those strong and powerful individuals that worship and meditate daily. Amida Buddha's primary concern rests with those beings whose abilities are so weak and tenuous that they can not hope to attain enlightenment on their own. Amida, realizing the sad plight of these humans, offered forty-eight vows, including the eighteenth Primal Vow.</p>
      <p>Knowing such an offering would be futile if never reaching the hearts of the poor and disenfranchised, Amida Buddha put his entire labor of Love in the sacred name — "Namu Amida Butsu." This Nembutsu is the embodiment of purity, truth, goodness, beauty, wisdom, and peace. This is referred to as the seed word. Amida is the Japanese version of the seed word. In Sanskrit the word is Amitabha. In this painting, Amida Buddha is seen here in a Buddhist mudra with points of fire and light emanating from his mandala, as well as with the seed word and the lotus flower.</p>`
  },

  // ══════════════════════════════════════════════════════
  // ASIAN LADIES
  // ══════════════════════════════════════════════════════

  {
    id: 'oiran',
    category: 'asian-ladies',
    title: 'Oiran #3',
    captionTitle: 'Oiran #3 – Obi In Front',
    year: 'Bakasan, 1986',
    medium: 'Acrylic on Canvas',
    size: '24″ × 36″',
    file: 'paintings/asian-ladies/Oiran.jpg',
    bodyHtml: `
      <p>This painting is of a Japanese Oiran. An Oiran is a very high priced "call-girl." In Japan, Courtesans wear the obi in front, as opposed to Geisha's (art girls) who wear their obi in back. To this day, Courtesans maintain a competitive, yet jealous relationship with Geishas who carry greater power and respect. This goal of this painting was to highlight the beauty of the obi. Most of this painting is monochromatic and flat, except the obi, which is meant to convey the illusion of three dimensions.</p>`
  },

  {
    id: 'brocade',
    category: 'asian-ladies',
    title: 'Brocade #12',
    captionTitle: 'Brocade #12',
    year: 'Bakasan, 1989',
    medium: 'Acrylic on Canvas',
    size: '24″ × 36″',
    file: 'paintings/asian-ladies/Brocade.jpg',
    bodyHtml: `
      <p>This painting also uses a monochromatic form to complement a fully three-dimensional brocade robe. The brocade design on the robe of this Japanese woman reveals partridges, chrysanthemums and butterflies. During a recent exhibition, many people walked up to this painting and touched it with the expectation of feeling a heavy brocaded textile.</p>`
  },

  {
    id: 'indonesian',
    category: 'asian-ladies',
    title: 'Indonesian Sari & Rug',
    captionTitle: 'Indonesian Sari & Rug',
    year: 'Bakasan, 1990',
    medium: 'Acrylic on Canvas',
    size: '24″ × 36″',
    file: 'paintings/asian-ladies/IndonesianSari.jpg',
    bodyHtml: `
      <p>This painting illustrates an Indonesian Girl wearing an Indonesian sari (skirt) wrapped in a rug/futon. The designs demonstrate authentic Indonesian patterns and shapes. In the Philippine and Indonesian archipelago, textiles and their intricate weaves and designs still leave viewers stunned.</p>`
  },

  {
    id: 'burmese',
    category: 'asian-ladies',
    title: 'Burmese (Myanmar)',
    captionTitle: 'Burmese Lady',
    year: 'Bakasan, 1984',
    medium: 'Acrylic on Canvas',
    size: '24″ × 36″',
    file: 'paintings/asian-ladies/Burmese.jpg',
    bodyHtml: `
      <p>The women of Burma (Myanmar) are renowned for their exquisite traditional dress, rich in geometric floral designs that reflect the country's long history of textile artistry. The longyi — the wrapped skirt worn by both men and women — is woven with intricate patterns of flowers, paisleys, and geometric motifs in vibrant jewel tones.</p>
      <p>In this painting, Bakasan explores the formal beauty of Burmese dress through its elaborate surface patterning. The geometric floral designs that cover the woman's garments are rendered with the same careful attention to pattern and color that distinguishes Burmese weaving traditions, where each design carries cultural and regional significance.</p>`
  },

  {
    id: 'kimono-rug',
    category: 'asian-ladies',
    title: 'Kimono On Rug',
    captionTitle: 'Kimono on Rug — Chinese Woman',
    year: 'Bakasan, 1989',
    medium: 'Acrylic on Canvas',
    size: '24″ × 36″',
    file: 'paintings/asian-ladies/kimono.jpg',
    bodyHtml: `
      <p>In this painting, a young Chinese woman sits on her flowered kimono, which rests on top of a rug. In many Asian countries, thick heavy textiles like this rug also serve as blankets to wrap around oneself on a cold night.</p>`
  },

  {
    id: 'peacock',
    category: 'asian-ladies',
    title: 'Peacock Kimono',
    captionTitle: 'Peacock Kimono — Japanese Geisha',
    year: 'Bakasan',
    medium: 'Acrylic on Canvas',
    size: '24″ × 36″',
    file: 'paintings/asian-ladies/Peacock.jpg',
    bodyHtml: `
      <p>Literally translated, Geisha means "art girl." A common misconception about Geishas is that they are used solely for sexual gratification. Actually, Geishas are far more than just sexual beings; they are usually highly intelligent, sophisticated women and one of the focal points of Japanese high culture.</p>
      <p>This painting illustrates the Japanese Geisha, who wears her obi in the back of her kimono, as opposed to the Courtesan, who wears it in the front of her kimono. On the Geisha's obi, flowers spring forth in celebrated sophistication. She holds a fan over her face, feigning shyness. On her kimono, the peacock is symbolically portrayed for its splendor and purity.</p>`
  },

  // ══════════════════════════════════════════════════════
  // FRAGMENTS OF NATURE
  // ══════════════════════════════════════════════════════

  {
    id: 'topanga46',
    category: 'nature',
    title: 'Topanga #46',
    captionTitle: 'Topanga #46 — Trees & Roots',
    year: 'Bakasan, 1982',
    medium: 'Acrylic on Masonite',
    size: '30″ × 40″',
    file: 'paintings/fragments-of-nature/treesandroots.jpg',
    bodyHtml: `
      <p>This painting demonstrates the results of the floods of 1982 in Southern California. This powerful tree was easily unearthed by the torrents of water that came tumbling down the hillsides of Topanga Canyon that winter. Such power brings to mind a favorite Buddhist saying of mine, "Foregoing the self, the Universe grows I."</p>`
  },

  {
    id: 'forest',
    category: 'nature',
    title: 'Forest for the Leaves',
    captionTitle: 'Forest for the Leaves',
    year: 'Bakasan, 1992',
    medium: 'Acrylic on Canvas',
    size: '24″ × 36″',
    file: 'paintings/fragments-of-nature/forest.jpg',
    bodyHtml: `
      <p>The theme of this painting (and a series of fifteen other paintings) relates to the following short poem: "Some have seen a Universe in a drop of dew, but old Baka sees a forest in a withered leaf." In this series of paintings, I painted entire forests within the leaves of my paintings.</p>`
  },

  {
    id: 'topanga103',
    category: 'nature',
    title: 'Topanga #103',
    captionTitle: 'Topanga #103 — Lumbini in Topanga',
    year: 'Bakasan, 1984',
    medium: 'Acrylic on Canvas',
    size: '24″ × 36″',
    file: 'paintings/fragments-of-nature/lumbini.jpg',
    bodyHtml: `
      <p>This surrealistic-colored fragment of nature is meant to evoke the moment of enlightenment as it appears in Topanga Canyon. I created this painting from the theme, "I am the forest seeing itself." The painting frames a spot in the Canyon where I was able to sit and meditate for years.</p>`
  },

  {
    id: 'topanga147',
    category: 'nature',
    title: 'Topanga #147',
    captionTitle: 'Topanga #147 — Debussy',
    year: 'Bakasan, 1983',
    medium: 'Acrylic on Canvas',
    size: '24″ × 30″',
    file: 'paintings/fragments-of-nature/Debussy.jpg',
    bodyHtml: `
      <h3 style="font-family:'Cormorant Garamond',Georgia,serif; font-weight:400; font-style:italic; font-size:1.1rem; color:var(--text-muted); margin-bottom:1rem;">Topanga Canyon — Debussy: an Interpretation</h3>
      <p>This painting is the centerpiece of a series of ten paintings brought to life by the music of Claude Debussy. From my first exposure to his music, I have enjoyed the impressionistic sounds of his work. In 1983, I set to work on translating his music as it would appear if it were a visual medium. First, I created the mood with blushes of color as if they were a series of notes played by a symphony. Visually, this was meant to evoke the light temporal resonance heard in his music. Then I used leafless branches of scrub trees as an interpretation of the airy staccato bursts also easily identified in Debussy's pieces. Last, I heavily relied on the use of negative space and shadow to provide the three-dimensional fullness heard in his unique tone poems.</p>`
  },

];  // ← end of PAINTINGS_DATA


// ════════════════════════════════════════════════════════════════
// TEMPLATE FOR A NEW PAINTING — copy, fill in, add to list above
// ════════════════════════════════════════════════════════════════
//
// {
//   id: 'painting-id',                 // lowercase, hyphens, unique
//   category: 'women',                 // women | iconography | asian-ladies | nature
//   title: 'Painting Title',
//   captionTitle: 'Painting Title',    // can be same as title or more descriptive
//   era: '14th Century',               // optional historical period
//   year: 'Bakasan, 2024',
//   medium: 'Acrylic on Canvas',
//   size: '24″ × 36″',
//   file: 'women-of-buddhism/painting-id.jpg',  // path relative to images/
//   bodyHtml: `
//     <p>First paragraph of the story...</p>
//     <p>Second paragraph...</p>`
// },
