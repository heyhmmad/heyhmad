import styles from "./HeroCanyon.module.css";

// Scalable artwork, not a screenshot. Edit the colors in Hero.module.css.
function Reeds({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g fill="none" stroke="var(--canyon-reed)" strokeWidth="3" strokeLinecap="round">
        <path d="M0 0 -15 -55 M3 0 8 -68 M7 0 23 -47 M-4 0 -27 -37 M10 0 33 -31" />
      </g>
      <g fill="var(--canyon-cattail)">
        <rect x="-19" y="-73" width="6" height="22" rx="3" transform="rotate(-11 -16 -62)" />
        <rect x="5" y="-84" width="6" height="21" rx="3" transform="rotate(5 8 -73)" />
        <rect x="21" y="-61" width="6" height="18" rx="3" transform="rotate(17 24 -52)" />
      </g>
    </g>
  );
}

export default function HeroCanyon() {
  return (
    <div className={styles.art} aria-hidden="true">
      <svg className={styles.scene} viewBox="0 0 1600 900" preserveAspectRatio="none" focusable="false">
        {/* Open distance: deliberately no little mountains at the river's end. */}
        <path fill="var(--canyon-sand)" d="M0 704 Q380 693 601 693 Q720 693 900 710 L1600 900 H0Z" />
        <path fill="var(--canyon-water)" d="M574 693 H650 C622 703 590 705 574 714 C552 725 654 719 673 733 C690 747 607 756 621 773 C642 799 842 803 876 831 C902 854 791 877 770 900 H424 C449 877 564 866 584 846 C611 821 523 809 549 785 C568 766 654 759 631 746 C614 735 539 739 532 726 C526 712 568 707 595 700Z" />

        {/* Rear canyon silhouettes — the only distant walls. */}
        <g stroke="var(--canyon-contour)" strokeWidth="1.4" strokeLinejoin="round">
          <path fill="var(--canyon-dust)" d="M0 438 L63 500 L112 516 L151 548 L243 565 L316 590 L357 653 L401 666 L436 698 L474 715 L512 735 L0 801Z" />
          <path fill="var(--canyon-dust)" d="M1600 125 L1497 153 L1418 207 L1397 252 L1310 275 L1276 333 L1196 362 L1151 431 L1099 475 L1012 503 L977 556 L927 574 L895 620 L820 639 L787 684 L737 701 L690 721 L1600 823Z" />
        </g>
        <g fill="var(--canyon-shade)" opacity=".22">
          <path d="M112 516 151 548 243 565 267 640 208 625 169 579Z" />
          <path d="M316 590 357 653 401 666 436 698 414 711 373 682 338 669Z" />
          <path d="M1397 252 1418 207 1457 180 1434 258 1374 302 1336 340 1310 275Z" />
          <path d="M927 574 895 620 820 639 787 684 761 695 799 633 877 602Z" />
        </g>

        {/* Broad middle faces keep the angular canyon character. */}
        <g stroke="var(--canyon-contour)" strokeWidth="1.5" strokeLinejoin="round">
          <path fill="var(--canyon-clay)" d="M0 423 L23 435 L49 498 L87 553 L166 579 L239 607 L272 667 L336 696 L413 718 L461 751 L545 782 L581 819 L0 871Z" />
          <path fill="var(--canyon-clay)" d="M1600 91 L1513 116 L1456 151 L1423 259 L1375 291 L1346 354 L1276 387 L1234 436 L1149 470 L1118 535 L1062 561 L1026 608 L951 626 L928 665 L858 690 L826 724 L766 748 L740 782 L1600 850Z" />
        </g>
        <g fill="var(--canyon-highlight)" opacity=".35">
          <path d="M0 423 23 435 49 498 87 553 166 579 154 597 77 569 36 511Z" />
          <path d="M239 607 272 667 336 696 413 718 461 751 432 745 397 735 319 711 257 682Z" />
          <path d="M1513 116 1456 151 1423 259 1375 291 1346 354 1325 361 1360 280 1404 245 1441 146Z" />
          <path d="M1118 535 1062 561 1026 608 951 626 928 665 908 675 936 613 1011 596 1048 552Z" />
        </g>

        {/* Foreground slopes, without the creature's projecting slab. */}
        <path fill="var(--canyon-plum)" d="M0 551 L61 577 L118 675 L181 696 L244 739 L312 766 L374 778 L418 804 L487 812 L524 837 L0 900Z" />
        <path fill="var(--canyon-plum)" d="M1600 328 L1531 349 L1483 377 L1446 456 L1384 483 L1349 540 L1267 567 L1234 612 L1171 640 L1112 687 L1054 697 L1022 743 L943 770 L916 794 L849 805 L804 825 L1600 900Z" />
        <g fill="var(--canyon-shade)" opacity=".5">
          <path d="M61 577 118 675 181 696 211 743 154 723 92 693Z" />
          <path d="M244 739 312 766 374 778 418 804 387 815 343 797 282 780Z" />
          <path d="M1531 349 1483 377 1446 456 1384 483 1414 505 1482 475 1514 399Z" />
          <path d="M1171 640 1112 687 1054 697 1022 743 988 754 1028 686 1096 668Z" />
        </g>
        <g fill="none" stroke="var(--canyon-contour)" strokeWidth="1.4" opacity=".8">
          <path d="M0 551 61 577 118 675 181 696 244 739 312 766 374 778 418 804 487 812 524 837" />
          <path d="M1600 328 1531 349 1483 377 1446 456 1384 483 1349 540 1267 567 1234 612 1171 640 1112 687 1054 697 1022 743 943 770 916 794 849 805 804 825" />
        </g>

        {/* Banks and the flowing river surface. */}
        <path fill="var(--canyon-sand)" d="M342 858 Q441 821 542 830 Q580 829 552 849 Q530 865 452 900 H0 V894Z" />
        <path fill="var(--canyon-sand)" d="M710 807 Q804 802 898 817 L1130 900 H763 Q787 877 846 854 Q865 841 790 828Z" />
        <g fill="none" stroke="var(--canyon-contour)" strokeLinecap="round">
          <path strokeWidth="2.6" d="M545 835 C623 837 615 852 558 866 S458 886 474 900" />
          <path strokeWidth="1.7" d="M717 825 C760 827 795 835 769 845 S662 862 674 874 S751 884 726 900" />
          <path strokeWidth="1.4" d="M731 834 C755 837 757 843 730 848 M505 864 479 871 M789 869 Q822 870 838 879" />
        </g>

        {/* Arched footbridge. */}
        <g fill="var(--canyon-bridge)" stroke="var(--canyon-bridge)" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M522 787 Q626 738 744 783 L744 805 Q632 757 522 810Z" />
          <path fill="var(--canyon-bridge-highlight)" stroke="none" d="M522 787 Q626 738 744 783 L742 791 Q630 748 524 797Z" />
          <g fill="none" strokeWidth="3.2">
            <path d="M524 760 Q628 716 744 756 M524 773 Q628 729 744 769" />
            <path d="M524 757V799 M555 745V783 M589 735V774 M626 731V772 M664 733V775 M703 742V785 M744 753V797" />
          </g>
          <g stroke="none">
            <circle cx="524" cy="756" r="3" /><circle cx="555" cy="744" r="3" />
            <circle cx="589" cy="734" r="3" /><circle cx="626" cy="730" r="3" />
            <circle cx="664" cy="732" r="3" /><circle cx="703" cy="741" r="3" />
            <circle cx="744" cy="752" r="3" />
          </g>
        </g>

        <Reeds x={457} y={782} scale={0.7} />
        <Reeds x={795} y={786} scale={0.68} />
        <Reeds x={335} y={866} scale={0.97} />
        <Reeds x={920} y={867} scale={1.03} />
        <g fill="var(--canyon-plum)" stroke="var(--canyon-bridge-highlight)" strokeWidth="1">
          <path d="M374 854 Q392 822 413 832 L445 852Z" />
          <path d="M832 818 Q846 798 864 815Z" />
          <path d="M847 876 Q861 846 887 851 L914 876Z" />
          <path d="M494 859 Q502 850 510 858Z" />
        </g>
        <path fill="var(--canyon-plum)" d="M0 739 Q94 756 163 794 Q211 822 255 843 L395 900 H0Z" />
        <path fill="none" stroke="var(--canyon-bridge-highlight)" strokeWidth="1.3" d="M0 739 Q94 756 163 794 Q211 822 255 843 L395 900" />
      </svg>
    </div>
  );
}
