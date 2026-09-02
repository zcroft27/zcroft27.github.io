# Collage decor image credits

Every file in this folder is derived from a public-domain source downloaded from
Wikimedia Commons and processed locally. No AI generation was used.

Two pipelines, chosen by what the original actually contains:

- **Ink-density cutouts** (`typewriter`, `trumpet`, `lobster`, `globe`, the
  original `pine-branch`, and `chess-knight`) come from monochrome engravings
  or etched plates: greyscale → invert → contrast-stretch → alpha = ink density,
  trimmed and resized to ~300px. These carry no colour of their own, so the site
  tints them at render time by using the PNG as a CSS mask and painting a palette
  colour through it.
- **Paper-keyed plates** (`pine-branch-color`) come from chromolithographs that
  are genuinely in colour. Alpha is instead "distance from paper white", so the
  sheet drops out and the original RGB survives. Because the artwork was printed
  over white, edge pixels are un-premultiplied against white before the alpha is
  applied — without that the piece would wear a pale halo on the dark field.

---

## `typewriter-underwood.png`

- **Subject:** Underwood Standard Typewriter No. 3
- **Source:** <https://commons.wikimedia.org/wiki/File:Skrifmaskin,_Underwood-maskin,_Nordisk_familjebok.png>
- **Creator / collection:** Engraving from *Nordisk familjebok* (2nd ed., 1904–1926), uncredited engraver
- **License:** Public domain (published pre-1929; copyright expired)

## `trumpet-military-f.png`

- **Subject:** Military trumpet in F, made by Besson
- **Source:** <https://commons.wikimedia.org/wiki/File:Britannica_Trumpet_Military_Trumpet_in_F.png>
- **Creator / collection:** Artist unknown; *Encyclopædia Britannica*, 11th ed. (1911), Vol. 27, p. 325
- **License:** Public domain (published pre-1929; copyright expired)

## `pine-branch.png`

- **Subject:** *Pinus sylvestris* (Scots pine) branch with cones
- **Source:** <https://commons.wikimedia.org/wiki/File:Pinus_sylvestris_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-106_(extracted).jpg>
- **Creator / collection:** Franz Eugen Köhler, *Köhler's Medizinal-Pflanzen* (1887), plate 106
- **License:** Public domain (published pre-1929; copyright expired)

## `pine-branch-color.png`

The same Köhler plate as above, kept in its original chromolithograph colour via
the paper-keying pipeline rather than flattened to ink density.

- **Subject:** *Pinus sylvestris* (Scots pine) branch with cones and catkin
- **Source:** <https://commons.wikimedia.org/wiki/File:Pinus_sylvestris_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-106_(extracted).jpg>
- **Creator / collection:** Franz Eugen Köhler, *Köhler's Medizinal-Pflanzen* (1887), plate 106
- **License:** Public domain (published pre-1929; copyright expired)

## `lobster.png`

- **Subject:** American lobster (*Homarus americanus*), male
- **Source:** <https://commons.wikimedia.org/wiki/File:FMIB_51213_American_Lobster_(Male).jpeg>
- **Creator / collection:** Drawing by James Henry Emerton, in George Brown Goode,
  *The Fisheries and Fishery Industries of the United States*, Section I (Washington, D.C.:
  Government Printing Office, 1884). Digitised by the Freshwater and Marine Image Bank,
  University of Washington.
- **License:** Public domain (U.S. Government publication, 1884)

## `globe.png`

- **Subject:** Terrestrial globe on a tilted stand
- **Source:** <https://commons.wikimedia.org/wiki/File:Globe_(PSF).png>
- **Creator / collection:** Pearson Scott Foresman, from the archive of line
  drawings the publisher released into the public domain and donated to
  Wikimedia Commons
- **License:** Public domain (released by the copyright holder)

## `zebra.png`

- **Subject:** The Zebra, plate 21 — hand-coloured steel engraving
- **Source:** <https://commons.wikimedia.org/wiki/File:Mammals-00030_ZEBRA_(22901095473).jpg>
- **Creator / collection:** drawn by Charles Hamilton Smith, engraved by W. H.
  Lizars, for Jardine's *The Naturalist's Library*
- **License:** Public domain (published 1830s)
- **Processing:** cut as a filled silhouette rather than as ink density. The
  usual ink key inverts a zebra — its white coat would go transparent and its
  dark stripes print pale — so instead the largest connected ink region is
  isolated, its enclosed area flood-filled to give the body, and the plate's own
  colour kept in the RGB. The drawn ground is removed by tracking each leg row
  by row down through the turf hatching. Palette-quantised to 64 colours.

## `chess-knight.png`

- **Subject:** Ornate crowned chess knight (horse head on a pedestal)
- **Source:** User-supplied reference image for this portfolio (site owner)
- **License:** Provided by the site owner for use on zcroft27.github.io — not a
  scraped public-domain plate
- **Processing:** leftmost piece cropped from a three-piece etched collage;
  black surround and parchment backing knocked out so only the ink etching
  remains as an alpha mask for palette tinting
