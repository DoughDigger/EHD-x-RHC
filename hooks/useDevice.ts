/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

export interface DeviceInfo {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isPortrait: boolean;
    isLandscape: boolean;
    isTouchDevice: boolean;
}

export const useDevice = (): DeviceInfo => {
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isPortrait: false,
        isLandscape: true,
        isTouchDevice: false,
    });

    useEffect(() => {
        const checkDevice = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Check for touch support
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

            // Orientation
            const isPortrait = height > width;
            const isLandscape = width >= height;

            // Device type based on width
            const isMobile = width < 768;
            const isTablet = width >= 768 && width < 1024;
            const isDesktop = width >= 1024;

            setDeviceInfo({
                isMobile,
                isTablet,
                isDesktop,
                isPortrait,
                isLandscape,
                isTouchDevice,
            });
        };

        // Initial check
        checkDevice();

        // Listen for resize and orientation changes
        window.addEventListener('resize', checkDevice);
        window.addEventListener('orientationchange', checkDevice);

        return () => {
            window.removeEventListener('resize', checkDevice);
            window.removeEventListener('orientationchange', checkDevice);
        };
    }, []);

    return deviceInfo;
};
