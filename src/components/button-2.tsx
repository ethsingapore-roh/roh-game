export const ButtonSVG2 = ({ isHovered }: { isHovered: boolean }) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='272'
        height='64'
        viewBox='0 0 272 64'
        fill='none'
        className='absolute inset-0'>
        <path
            d='M6 57.876V31.6748L31.7988 5.87598H266V32.077L240.201 57.876H6Z'
            fill={isHovered ? '#90FE74' : 'black'}
        />
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M0 28.9049V63.6383H242.603L271.334 34.9071V1.10865e-05L29.1631 0L0 28.9049ZM1 62.6383H242.189L270.334 34.4929V1.00001L29.5747 1L1 29.3217V62.6383Z'
            fill='#90FE74'
        />
    </svg>
)
