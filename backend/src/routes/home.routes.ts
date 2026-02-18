// src/routes/home.routes.ts
import { Router } from 'express';
import * as homeController from '../controllers/home.controller';

const router = Router();

// GET /api/home/banners
router.get('/banners', homeController.getHomeBanners);

// POST /api/home/search 
router.post('/search', homeController.searchHotels);

// GET /api/home/hotels/:hotelId
router.get('/hotels/:hotelId', homeController.getHotelDetail);

// GET /api/home/hotels/:hotelId/rooms
router.get('/hotels/:hotelId/rooms', homeController.getRoomList);

export default router;