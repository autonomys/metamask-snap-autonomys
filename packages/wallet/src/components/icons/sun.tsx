import React from 'react'
import { SvgIconProps } from './types'

export const SunIcon: React.FC<SvgIconProps> = ({ width = '256px', height = '256px', fill = 'black' }) => {
  return (
    <svg width={width} height={height} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M7.28451 10.3333C7.10026 10.8546 7 11.4156 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C11.4156 7 10.8546 7.10026 10.3333 7.28451'
        stroke={fill}
        stroke-width='1.5'
        stroke-linecap='round'
      />
      <path d='M12 2V4' stroke={fill} stroke-width='1.5' stroke-linecap='round' />
      <path d='M12 20V22' stroke={fill} stroke-width='1.5' stroke-linecap='round' />
      <path d='M4 12L2 12' stroke={fill} stroke-width='1.5' stroke-linecap='round' />
      <path d='M22 12L20 12' stroke={fill} stroke-width='1.5' stroke-linecap='round' />
      <path d='M19.7778 4.22266L17.5558 6.25424' stroke={fill} stroke-width='1.5' stroke-linecap='round' />
      <path d='M4.22217 4.22266L6.44418 6.25424' stroke={fill} stroke-width='1.5' stroke-linecap='round' />
      <path d='M6.44434 17.5557L4.22211 19.7779' stroke={fill} stroke-width='1.5' stroke-linecap='round' />
      <path d='M19.7778 19.7773L17.5558 17.5551' stroke={fill} stroke-width='1.5' stroke-linecap='round' />
    </svg>
  )
}
