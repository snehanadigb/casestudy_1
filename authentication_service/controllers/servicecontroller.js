const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const sendEmail = require('../utils/emailservice');

const selectService = async (req, res) => {
    const { customerId } = req;
    const { serviceName } = req.body;

    try {
        const service = await prisma.service.create({
            data: {
                name: serviceName,
                customerId: parseInt(customerId)
            }
        });

        // Send email confirming service selection
        const customer = await prisma.customer.findUnique({ where: { id: customerId } });
        await sendEmail(customer.email, 'Service Selection', `You have selected the service: ${serviceName}`);

        res.status(201).json({ message: 'Service selected successfully', service });
    } catch (error) {
        res.status(500).json({ message: 'Service selection failed', error });
    }
};

const activateService = async (req, res) => {
    const { serviceId } = req.body;

    try {
        const service = await prisma.service.update({
            where: { id: parseInt(serviceId) },
            data: { isActive: true }
        });

        // Send email confirming service activation
        const customer = await prisma.customer.findUnique({ where: { id: service.customerId } });
        await sendEmail(customer.email, 'Service Activation', 'Your service has been successfully activated.');

        res.status(200).json({ message: 'Service activated successfully', service });
    } catch (error) {
        res.status(500).json({ message: 'Service activation failed', error });
    }
};

module.exports = { selectService, activateService };
