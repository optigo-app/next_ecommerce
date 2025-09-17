import React from 'react'
import './TheDifference.modul.scss'
import { assetBase } from '@/app/(core)/lib/ServerHelper'

const TheDifference = () => {
  return (
    <div className="smilingPAgeMain" style={{ paddingBlock: '8%' }}>
      <p
        className="smilingTitle"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          ease: 'easeIn',
        }}
        viewport={{ once: true, amount: 0.2 }}
      >
        The Sonasons Difference
      </p>

      <div className="smr_smilingRock">
        {/* First Image */}
        <div
          className="smr_smilingRockBox"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.4,
            ease: 'easeIn',
            delay: 0.2, // Delay for the first image
          }}
        >
          <div className="smr_diffrence_box1_main">
            <img
              className="smr_deffrence_img"
              src={`${assetBase}/images/HomePage/TheDifference/TheDifference1.webp`}
              alt="Natural Diamond & jewellery"
            />
          </div>
          <div className="smr_diffrence_box2_main">
            <p className="smr_smilingBoxName">Natural Diamond & jewellery</p>
          </div>
        </div>

        {/* Second Image */}
        <div
          className="smr_smilingRockBox"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.4,
            ease: 'easeIn',
            delay: 0.4, // Delay for the second image
          }}
        >
          <div className="smr_diffrence_box1_main">
            <img
              className="smr_deffrence_img"
              src={`${assetBase}/images/HomePage/TheDifference/TheDifference2.webp`}
              alt="1% of each purchase goes to your choice of charity"
            />
          </div>
          <div className="smr_diffrence_box2_main">
            <p className="smr_smilingBoxName">
              1% of each purchase goes to your choice of charity
            </p>
          </div>
        </div>

        {/* Third Image */}
        <div
          className="smr_smilingRockBox"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.4,
            ease: 'easeIn',
            delay: 0.6, // Delay for the third image
          }}
        >
          <div className="smr_diffrence_box1_main">
            <img
              className="smr_deffrence_img"
              src={`${assetBase}/images/HomePage/TheDifference/TheDifference3.webp`}
              alt="Laser inscribed diamonds with Sonasons logo"
            />
          </div>
          <div className="smr_diffrence_box2_main">
            <p className="smr_smilingBoxName">Laser inscribed diamonds with Sonasons logo</p>
          </div>
        </div>

        {/* Fourth Image */}
        <div
          className="smr_smilingRockBox"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.4,
            ease: 'easeIn',
            delay: 0.8, // Delay for the fourth image
          }}
        >
          <div className="smr_diffrence_box1_main">
            <img
              className="smr_deffrence_img"
              src={`${assetBase}/images/HomePage/TheDifference/TheDifference4.webp`}
              alt="ECG+ Certified Brand Butterfly Mark"
            />
          </div>
          <div className="smr_diffrence_box2_main">
            <p className="smr_smilingBoxName">ECG+ Certified Brand Butterfly Mark</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheDifference;
