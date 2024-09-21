export const ButtonSVG1 = ({ isHovered }: { isHovered: boolean }) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='272'
        height='64'
        viewBox='0 0 272 64'
        fill='none'
        className='absolute inset-0'>
        <path d='M6 58V31.7988L31.7988 6H266V32.201L240.201 58H6Z' fill={isHovered ? 'black' : '#90FE74'} />
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M0.248901 29.029V63.7623H242.852L271.583 35.0311V0.124035L29.412 0.124023L0.248901 29.029ZM1.2489 62.7623H242.437L270.583 34.6169V1.12403L29.8236 1.12402L1.2489 29.4458V62.7623Z'
            fill='#90FE74'
        />
    </svg>
)
